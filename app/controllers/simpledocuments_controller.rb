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
  
  def create_shared_link
    create_link(params[:box_id])
    render json: @link[:preview_url]
  end
  
  def previous_folder
    box_content_resources[:basic]["folders/#{params[:box_id]}"].get() { |response, request, result, &block|
      check_request_success(response, "read file")
      @parent = JSON.parse(response)['parent']['id']
    }
    redirect_to get_user_documents_path(folder: @parent)
  end
  
  def update
    req_params = {
      name: params[:name]
    }
    
    params[:type] == "folder" ? @box_object = 'folders' : @box_object = 'files'
      
    box_content_resources[:basic]["#{@box_object}/#{params[:box_id]}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "updated")
      logger.info response
    }
    render nothing: true
  end
  
  def index
    req_params = { 
      fields: "id,name,created_at,modified_at,size,type"
    }

    box_content_resources[:basic]["folders/#{params[:folder]}/items"].get(params: req_params) { |response, request, result, &block|
      check_request_success(response, "index")
      if @return
        return
      else
        @folder_name = JSON.parse(response)['name']
        @documents = []
        JSON.parse(response)['entries'].each do |file|
          @documents << file
        end
      end
    }
  end

  def upload_file
    req_params = {
      attributes: { name: params[:file].original_filename, 
                    parent: {id: params[:folder] }}.to_json,
      file: File.new(params[:file].path)
    }

    box_content_resources[:upload].post(req_params, :content_type => "application/json") { |response, request, result, &block|
      check_request_success(response, "upload file")
    }
    redirect_to get_user_documents_path(folder: params[:folder])
  end

  def download
    box_content_resources[:basic]["files/#{params[:box_id]}/content"].get() { |response, request, result, &block|
      check_request_success(response, "download file")
      @dl_url = response.headers[:location]
    }
    
    respond_to do |format|
      format.html { redirect_to(@dl_url) }
      format.json { render json: {url: @dl_url}.to_json }
    end
    
  end
  
  def show
    create_link(params[:box_id])
    redirect_to @link[:preview_url]
  end
  
  def destroy
    logger.info params[:type]
    params[:type] == "folder" ? @box_object = 'folders' : @box_object = 'files'
    
    box_content_resources[:basic]["#{@box_object}/#{params[:box_id]}"].delete(params: {recursive: true}) { |response, request, result, &block|
      @response = response.code
      check_request_success(response, "destroy")
    }
    render json: @response  
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
  
  def ariane_wire
    @ariane_wire = {}
    @parent_id = params[:box_id]
    @i = 0
    
    until @parent_id == '0'
      box_content_resources[:basic]["folders/#{@parent_id}"].get() { |response, request, result, &block|
        check_request_success(response, "create ariane")
        @parent_id = JSON.parse(response)['parent']['id'] if JSON.parse(response)['parent']
        @ariane_wire[@i] = { name: JSON.parse(response)['name'], id: JSON.parse(response)['id'] }
        @i+=1
      }
    end
    
    respond_to do |format|
      format.html { render json: @ariane_wire }
      format.json { render json: @ariane_wire }
    end
  end
  
  private
  
	def document_params
    params.require(:document).permit(:folder, :id, :type)
  end
  
end
