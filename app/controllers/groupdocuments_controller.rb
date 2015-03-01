class GroupdocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :has_group?
  before_action :get_folder, only: [:read_folder, :create_file]
  before_action :get_file, only: [:destroy_file]
    
  def read_folder
    
    @group_folders = current_group.groupfolders.where(parent_id: params[:folder_id])
    @new_folder = @folder.groupdocuments.new()
    
    if current_user.id == current_group.admin_id
      @group_documents = @folder.groupdocuments
      @firepads = @folder.firepads
    else
      @group_documents = @folder.groupdocuments.where(admin: true)
      @firepads = @folder.firepads.where(admin: true)
    end
    
    @current_group = current_group
    
    @breadcrumbs = []
    @root = true
    
    @folder = Groupfolder.find params[:folder_id]
    if @folder.parent_id != 100
      @parent = Groupfolder.find @folder.parent_id
      @root = false
    end
    
    if @parent
      while @root != true do
        logger.info @parent.name
        @breadcrumbs << { name: @parent.name, id: @parent.id } if @parent.name != nil
        @parent = if @parent.parent_id != 100 then Groupfolder.find @parent.parent_id else @root = true end
      end
    end
    
    @breadcrumbs = @breadcrumbs.reverse
    logger.info @breadcrumbs
    render "index"
  end
  
  def read_file
    create_link(params[:box_id])
    if @link # owner
      redirect_to @link[:preview_url]
    else # not owner
      document = Groupdocument.where(box_id: params[:box_id]).first
      redirect_to document.share_url
    end
  end
  
  def download_file
    create_link(params[:box_id])
    if @link
      render json: {url: @link[:download_url]}.to_json 
    else
      document = Groupdocument.where(box_id: params[:box_id]).first
      render json: {url: document.share_url}.to_json
    end
  end
  
  def transfer_file
    @file = Groupdocument.find params[:item_id]
    @clone = @file.clone
    @attributes = {
      box_id: @clone.box_id, share_url: @clone.share_url, dl_url: @clone.dl_url, groupfolder_id: @clone.groupfolder_id, name: @clone.name, owner: @clone.owner, size: @clone.size
    }
    @transfered = Groupdocument.new(@attributes)
    @groupfolder = Groupfolder.where(["group_id = :group_id and parent_id = :parent_id", { group_id: params[:group_id], parent_id: 100 }]).first
    @transfered.groupfolder_id = @groupfolder.id
    @transfered.admin = true if Group.find(params[:group_id]).admin_id == current_user.id 
    @transfered.save
    render :nothing => true
  end
  
  def transfer_folder
    @folder = Groupfolder.find params[:item_id]
    @clone = @folder.clone
    @attributes = {
      parent_id: @clone.parent_id, name: @clone.name, group_id: @clone.group_id
    }
    @transfered = Groupfolder.new(@attributes)
    @transfered.group_id = params[:group_id]
    @transfered.parent_id = Groupfolder.where(group_id: params[:group_id]).first.id
    @transfered.save
    render :nothing => true
  end
  
  def rename_file
    @file = Groupdocument.find params[:item_id]
    @file.update(name: params[:name])
    render :nothing => true
  end
  
  def rename_folder
    @folder = Groupfolder.find params[:item_id]
    @folder.update(name: params[:name])
    render :nothing => true
  end
  
  def create_shared_link
    create_link(params[:box_id])
    if @link
      render json: @link[:preview_url]
    else
      document = Groupdocument.where(box_id: params[:box_id]).first
      render json: document.share_url
    end
  end
  
  def create_file
    req_params = {
      attributes: { name: params[:file].original_filename, 
                    parent: {id: 0 }}.to_json,
      file: File.new(params[:file].path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response)
      return false if @return
      
      if response.code != 409
        @response = JSON.parse(response)
        @doc_params = {
          box_id: @response['entries'].first['id'],
          name: params[:file].original_filename,
          size: @response['entries'].first['size'],
          owner: @response['entries'].first['created_by']['name'],
        }
      elsif response.code == 409
        @search_id = JSON.parse(response)['context_info']['conflicts']['id']
        @need_to_search = true
      end
    }
    
    if @need_to_search == true
      box_content_resources[:basic]["files/#{@search_id}"].get() { |response, request, result, &block|
        check_request_success(response)
        return false if @return
      
        @response = JSON.parse(response)
        @doc_params = {
          box_id: @search_id,
          name: @response['name'],
          size: @response['size'],
          owner: @response['created_by']['name']
        }
      }
    end
    
    @doc_params[:admin] = true if Group.find(params[:group_id]).admin_id == current_user.id 
    logger.info Group.find(params[:group_id]).admin_id
    logger.info current_user.id
    @folder.groupdocuments.create(@doc_params)
    create_link(@doc_params[:box_id])
    redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id])

  end
  
  def create_folder
    respond_to do |format|
      if current_group.groupfolders.create(name: 'New Folder', parent_id: params[:folder_id])
     	  format.html { redirect_to get_group_documents_path( groupdocuments_params ) }
     		format.json {  }
      end
   	end
  end
  
  def destroy_file
    @file.update(deleted: true)
    render :nothing => true
  end
  
  def destroy_folder
    @folder = Groupfolder.find params[:folder_id]
    @folder.groupdocuments.each { |file| file.update(deleted: true)}
    Groupfolder.where(parent_id: @folder.id).each { |folder| folder.destroy}
    @folder.destroy
    render :nothing => true
  end
  
  def move_file
    @file = Groupdocument.find params[:dragged]
    @file.update_attributes(groupfolder_id: params[:dropped])
    render :nothing => true
  end
  
  def move_folder
    @folder = Groupfolder.find params[:dragged]
    @folder.update_attributes(parent_id: params[:dropped])
    render :nothing => true
  end
  
  private
  
  def groupdocuments_params
    { 
      group_id: params[:group_id],
      folder_id: params[:folder_id]
    }
  end
  
  def get_file
    @file = Groupdocument.find params[:file_id]
  end
  
  def get_folder
    if params[:parent_id]
      @folder = current_group.groupfolders.find_by parent_id: params[:parent_id]
      params[:folder_id] = @folder.id
    else
      @folder = current_group.groupfolders.find params[:folder_id]
    end
  end
  
end
