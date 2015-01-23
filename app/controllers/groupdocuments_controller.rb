class GroupdocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :get_folder, only: [:read_folder, :create_file]
  before_action :get_file, only: [:destroy_file]
    
  def read_folder
    @group_folders = current_group.groupfolders.where(parent_id: params[:folder_id])
    @new_folder = @folder.groupdocuments.new()
    @group_documents = @folder.groupdocuments
    
    @breadcrumbs = []
    @root = true
    
    @folder = Groupfolder.find params[:folder_id]
    if @folder.parent_id != 100
      @parent = Groupfolder.find @folder.parent_id
      @root = false
    end
    
    if @parent
      while @root != true do
        @breadcrumbs = @breadcrumbs << { name: @parent.name, id: @parent.id }
        @parent = if @parent.parent_id != 100 then Groupfolder.find @parent.parent_id else @root = true end
      end
    end
    @breadcrumbs = @breadcrumbs.reverse
    render "index"
  end
  
  def read_file
    create_link(params[:box_id])
    redirect_to @link[:preview_url]
  end
  
  def download_file
    create_link(params[:box_id])
    render json: {url: @link[:download_url]}.to_json 
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
    render json: @link[:preview_url]
  end
  
  def create_file
    req_params = {
      attributes: { name: params[:file].original_filename, 
                    parent: {id: 0 }}.to_json,
      file: File.new(params[:file].path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response, "upload file")
      @response = JSON.parse(response)
      @doc_params = {
        box_id: @response['entries'].first['id'],
        name: params[:file].original_filename,
        size: @response['entries'].first['size'],
        owner: @response['entries'].first['created_by']['name']
      }
    }
    logger.info @doc_params
    @folder.groupdocuments.create(@doc_params)

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
