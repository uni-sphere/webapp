class GroupdocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :get_folder, only: [:read_folder, :create_file, :move_folder, :destroy_folder]
  before_action :get_file, only: [:move_file, :destroy_file]
    
  def read_folder
    @new_folder = @folder.groupdocuments.new()
    @group_documents = @folder.groupdocuments
    @group_folders = current_group.groupfolders.where(parent_id: params[:folder_id])
    
    render "index"
  end
  
  def create_file
    path = params[:file].path
    name = params[:file].original_filename.to_s
    req_params = {
      name: name.to_s,
      parent_id: 0,
      file: File.new(path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response, "upload file")
      logger.info response
      @file_id = JSON.parse(response)["entries"].first['id']
    }
      
    @folder.groupdocuments.create(box_id: @file_id, name: name)
    
    redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id])
  end
  
  def show_file
    create_link(params[:box_id])
    redirect_to @link[:preview_url]
  end
  
  def create_folder
    respond_to do |format|
      if current_group.groupfolders.create(name: 'new folder', parent_id: params[:folder_id])
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id]) }
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
      if @folder.destroy
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id]) }
     		format.json {  }
      end
   	end
  end
  
  def move_file
    respond_to do |format|
      if @file.update_attributes(file_id: params[:file_id])
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id]) }
     		format.json {  }
      end
   	end
  end
  
  def move_folder
    respond_to do |format|
      if @folder.update_attributes(parent_id: params[:parent_id])
     	  format.html { redirect_to get_group_documents_path(group_id: params[:group_id]) }
     		format.json {  }
      end
   	end
  end
  
  private
  
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
