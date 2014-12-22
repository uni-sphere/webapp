class GroupdocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :get_folder, only: [:read_folder, :create_file]
  before_action :get_file, only: [:destroy_file]
    
  def read_folder
    @group_folders = current_group.groupfolders.where(parent_id: params[:folder_id])
    @new_folder = @folder.groupdocuments.new()
    @group_documents = @folder.groupdocuments
    render "index"
  end
  
  def read_file
    box_content_resources[:basic]["files/#{params[:box_id]}"].get() { |response, request, result, &block|
      check_request_success(response, "read file")
      @response = JSON.parse(response)
    }
    
    respond_to do |format|
      format.html { }
      format.json { render json: {
        created_at: (@response['created_at']),
        modified_at: (@response['modified_at']),
        owner: @response['created_by']['name'],
        size: @response['size'],
        shared_link: @response['shared_link']['url'],
        file_name: @response['name']
        }
      }
    end
  end
  
  def create_file
    path = params[:file].path
    @name = params[:file].original_filename.to_s
    req_params = {
      name: @name.to_s,
      parent_id: '0',
      file: File.new(path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response, "upload file")
      @file_id = JSON.parse(response)["entries"].first['id']
    }
    
    @folder.groupdocuments.create(box_id: @file_id, name: @name)

    redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id])
  end
  
  def show_file
    create_link(params[:box_id])
    redirect_to @link[:preview_url]
  end
  
  def create_folder
    respond_to do |format|
      if current_group.groupfolders.create(name: 'new folder', parent_id: params[:folder_id])
     	  format.html { redirect_to get_group_documents_path( groupdocuments_params ) }
     		format.json {  }
      end
   	end
  end
  
  def destroy_file
    respond_to do |format|
      if @file.destroy
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id]) }
     		format.json {  }
      end
   	end
  end
  
  def destroy_folder
    respond_to do |format|
      if Groupfolder.find(params[:target_folder]).destroy
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id])  }
     		format.json {  }
      end
   	end
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
