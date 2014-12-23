class SimpledocumentsController < ApplicationController
  
  before_action :authenticate?

  def create_folder
    req_params = {
      name: "New Folder",
      parent: { id: params[:folder] }
    }

    box_content_resources[:basic]["folders"].post(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "create folder")
    }
    redirect_to get_user_documents_path(folder: params[:folder])
  end
  
  def update
    req_params = {
      name: params[:name]
    }
    
    params[:type] == "folder" ? @box_object = 'folder' : @box_object = 'file'
      
    box_content_resources[:basic]["#{@box_object}/#{params[:box_id]}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "updated")
      logger.info response
    }
  end
  
  def index
    @folder = params[:folder]
    @document_url = params[:document_url] if params[:document_url]
    req_params = { 
      fields: "id,name,created_at,modified_at,size,type"
    }
    
    box_content_resources[:basic]["folders/#{params[:folder]}/items"].get(params: req_params) { |response, request, result, &block|
      check_request_success(response, "index")
      @documents = []
      JSON.parse(response)['entries'].each do |file|
        @documents << file
      end
      logger.info @documents
    }
  end

  def upload_file
    path = params[:file].path
    name = params[:file].original_filename.to_s
    req_params = {
      name: name.to_s,
      parent_id: params[:folder],
      file: File.new(path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response, "upload file")
    }
    redirect_to get_user_documents_path(folder: params[:folder])
  end

  def download
    box_content_resources[:basic]["files/#{params[:id]}/content"].get() { |response, request, result, &block|
      check_request_success(response, "download file")
      redirect_to(response.headers[:location])
    }
  end
  
  def show
    create_link(params[:box_id])
    redirect_to @link[:preview_url]
  end
  
  def destroy
    logger.info params[:type]
    params[:type] == "folder" ? @box_object = 'folders' : @box_object = 'files'
    
    box_content_resources[:basic]["#{@box_object}/#{params[:id]}"].delete(params: {recursive: true}) { |response, request, result, &block|
      logger.info response
      check_request_success(response, "destroy")
    }
    
    redirect_to get_user_documents_path(folder: params[:folder])
  end
  

  def move_file
    req_params = {
      parent: { id: params[:dropped] }
    }
    box_content_resources[:basic]["files/#{params[:dragged]}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "file moved")
    }
    render nothing: true
  end
  
  def move_folder
    req_params = {
      parent: { id: params[:dropped] }
    }
    box_content_resources[:basic]["folders/#{params[:dragged]}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "folder moved")
    }
    render nothing: true
  end
  
  private
  
	def document_params
    params.require(:document).permit(:folder, :id, :type)
  end
  
end
