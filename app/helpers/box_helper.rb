module BoxHelper
  
  RestClient.log =
    Object.new.tap do |proxy|
      def proxy.<<(message)
        Rails.logger.info message
      end
    end
    
  def box_params
    {
      client_id: "hscdzqs2qj9alkm1nc4t5pzqc8e8acyj",
      client_secret: "bxS7khRuT3LL66JT4XyqykGVRANFPVr0",
      view_id: "ym4aecemo21d9im7u3kc41a3i1fctlmk"
    }
  end
  
  def box_content_resources
    {
      token: RestClient::Resource.new('https://api.box.com/oauth2/token'),
      authorize: RestClient::Resource.new('https://app.box.com/api/oauth2/authorize'),
      basic: RestClient::Resource.new('https://api.box.com/2.0/', headers: { Authorization: "Bearer #{cookies[:access_token]}" }),
      upload: RestClient::Resource.new('https://upload.box.com/api/2.0/files/content', headers: { Authorization: "Bearer #{cookies[:access_token]}" })                                                                  
    }
  end
  
  def box_view_resources
    {
      document: RestClient::Resource.new('https://view-api.box.com/1/documents', headers: { Authorization: "Token #{box_params[:view_id]}", :content_type => 'application/json'}),
      session: RestClient::Resource.new('https://view-api.box.com/1/sessions', headers: { Authorization: "Token #{box_params[:view_id]}", :content_type => 'application/json'})  
    }
  end
  
  def check_request_success(response, comment)
    logger.info comment
    case response.code
    when 401 then refresh_token
    when 200 then logger.info(response.code)
    when 400 then logger.info(response.code)
    end
  end
  
  def send_access_token
    access_token_params = {
      grant_type: 'authorization_code',
      code: params[:code],
      client_id: box_params[:client_id],
      client_secret: box_params[:client_secret]
    }
    
    box_content_resources[:token].post(access_token_params) { |response, request, result, &block|
      check_request_success(response, "send_access_token")
      set_token(JSON.parse(response))
    }
    redirect_to get_user_documents_path(folder: params[:folder] ? params[:folder] : '0' )
  end
  
  def set_token(response)
    cookies[:access_token] = response['access_token']
    cookies[:refresh_token] = response['refresh_token']
    logger.info "set token"
  end
  
  def refresh_token
    refresh_token_params = {
      grant_type: 'refresh_token',
      refresh_token: cookies.permanent.signed[:refresh_token],
      client_id: box_params[:client_id],
      client_secret: box_params[:client_secret]
    }
  
    box_content_resources[:token].post(refresh_token_params,  :accept => :json ) { |response, request, result, &block|
      check_request_success(response, "refresh_token")
      set_token(JSON.parse(response))
    }
    logger.info "refresh token"
  end
  
  # perso
  
  def create_box(email)
    box_creation_params = {
      grant_type: 'urn:box:oauth2:grant-type:provision',
      client_id: box_params[:client_id],
      client_secret: box_params[:client_secret],
      username: email
    }

    box_content_resources[:token].post(box_creation_params) { |response, request, result, &block|
      logger.info(response.args)
      check_request_success(response, "box_creation")
    }
  end
  
  def create_link(box_id)
    req_params = {
      shared_link: {access: "open",
                    can_download: true,
                    can_preview: true
      }
    }
      
    box_content_resources[:basic]["files/#{box_id}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response, "updated")
      logger.info response
      @links = {
        preview_url: JSON.parse(response)['shared_link']['url'],
        download_url: JSON.parse(response)['shared_link']['download_url']
      }
    }
    if @folder.groupdocuments.exists?(box_id: box_id)
      document = @folder.groupdocuments.find_by box_id: box_id
      document.update_attributes(preview_url: @links[:preview_url], download_url: @links[:download_url])
    else
      @folder.groupdocuments.create(preview_url: preview_url, download_url: download_url, document_id: box_id)
    end
  end

end










