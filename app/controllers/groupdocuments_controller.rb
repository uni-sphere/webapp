class GroupdocumentsController < ApplicationController
  
  before_action :authenticate?
  before_action :get_folder, only: [:read_folder, :create_file, :move_folder, :destroy_folder]
  before_action :get_file, only: [:move_file, :destroy_file]
    
  def read_folder
    @new_folder = @folder.groupdocuments.new()
    
    @folder.groupdocuments.each do |document|
      box_content_resources[:basic]["files/#{document.box_id}"].get() { |response, request, result, &block|
        check_request_success(response, "read file")
        # @unshared_at = JSON.parse(response)['shared_link']['unshared_at'] if JSON.parse(response)['shared_link']['unshared_at']
      }
      # create_link(document_id) if @unshared_at < Time.now.to_i
    end
    
    @group_documents = @folder.groupdocuments
    @group_folders = current_group.groupfolders.where(parent_id: params[:folder_id])
    @group_id = params[:group_id]
    
    # popup
    
    req_params = {
      fields: "id,name,created_at,modified_at,size,type"
    }
    box_content_resources[:basic]["folders/0/items"].get(params: req_params) { |response, request, result, &block|
      check_request_success(response, "index")
      @documents = []
      if JSON.parse(response)["entries"]
        JSON.parse(response)["entries"].each do |file|
          @documents << file
        end
      end
    }
    
    render "index"
  end
  
  def create_file
    if params[:file]
      path = params[:file].path
      name = params[:file].original_filename.to_s
      req_params = {
        name: name.to_s,
        parent_id: params[:folder_id],
        file: File.new(path)
      }

      box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
        check_request_success(response, "upload file")
        @file_id = JSON.parse(response)["entries"].first['id']
      }
      
      @folder.groupdocuments.create(box_id: @file_id, group_id: current_group.id)
      create_link(@file_id)
    else
      @folder.groupdocuments.create(box_id: params[:file_id], group_id: current_group.id, parent_id: params[:folder_id])
      create_link(params[:file_id])
    end
    
    redirect_to get_group_documents_path(group_id: params[:group_id], folder_id: params[:folder_id])
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
      if @file.update_attributes(parent_id: params[:parent_id])
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
    @folder = current_group.groupfolders.where(parent_id: params[:folder_id]).first
  end
  
end
