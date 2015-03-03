module BoxHelper
  
  # https://unisphereapp.appsdeck.eu/user/receive_oauth
  # https://www.unisphereapp.appsdeck.eu/user/documents

  # http://localhost:3000/user/receive_oauth
  # http://localhost:3000/user/documents

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
    if !current_user.boxtoken.nil?
      {
        basic: RestClient::Resource.new('https://api.box.com/2.0/', headers: { Authorization: "Bearer #{current_user.boxtoken.access_token}" }),
        upload: RestClient::Resource.new('https://upload.box.com/api/2.0/files/content', headers: { Authorization: "Bearer #{current_user.boxtoken.access_token}" })                                                                  
      }
    end
  end
  
  def box_oauth_resources
    {
      token: RestClient::Resource.new('https://api.box.com/oauth2/token'),
      authorize: RestClient::Resource.new('https://app.box.com/api/oauth2/authorize')                              
    }
  end
  
  def box_view_resources
    {
      document: RestClient::Resource.new('https://view-api.box.com/1/documents', headers: { Authorization: "Token #{box_params[:view_id]}", :content_type => 'application/json'}),
      session: RestClient::Resource.new('https://view-api.box.com/1/sessions', headers: { Authorization: "Token #{box_params[:view_id]}", :content_type => 'application/json'})  
    }
  end
  
  def check_request_success(response)
    @return = false
    logger.info(response.code)
    if response.code == 401 || response.code == 400
      send_oauth
      @return = true
    end
  end
  
  def send_oauth
    oauth_params = {
      response_type: 'code',
      client_id: box_params[:client_id],
      state: session[:_csrf_token]
    }

    box_oauth_resources[:authorize].get(params: oauth_params) { |response, request, result, &block|
      redirect_to(request.url)
    }
  end
  
  def send_access_token
    access_token_params = {
      grant_type: 'authorization_code',
      code: params[:code],
      client_id: box_params[:client_id],
      client_secret: box_params[:client_secret]
    }
    
    box_oauth_resources[:token].post(access_token_params) { |response, request, result, &block|
      set_token(JSON.parse(response))
    }
    redirect_to get_user_documents_path(folder: params[:folder] ? params[:folder] : '0' )
  end
  
  def set_token(response)
    
    if !current_user.boxtoken.nil?
      current_user.boxtoken.update(access_token: response['access_token'], refresh_token: response['refresh_token'])
    else
      current_user.create_boxtoken(access_token: response['access_token'], refresh_token: response['refresh_token'])
    end
    
  end
  
  def refresh_token
    if current_user
      if !current_user.boxtoken.nil?
        if current_user.boxtoken.updated_at < 30.minutes.ago
          refresh_token_params = {
            grant_type: 'refresh_token',
            refresh_token: current_user.boxtoken.refresh_token,
            client_id: box_params[:client_id],
            client_secret: box_params[:client_secret]
          }
  
          box_oauth_resources[:token].post(refresh_token_params,  :accept => :json ) { |response, request, result, &block|
            check_request_success(response)
            return false if @return
            set_token(JSON.parse(response))
          }
          logger.info "refresh token"
        end
      end
    end
  end
  
  # perso
  
  def create_box(email)
    box_creation_params = {
      grant_type: 'urn:box:oauth2:grant-type:provision',
      client_id: box_params[:client_id],
      client_secret: box_params[:client_secret],
      username: email
    }

    box_oauth_resources[:token].post(box_creation_params) { |response, request, result, &block|
      logger.info response
    }
  end
  
  def create_link(box_id)
    req_params = {
      shared_link: {
        access: "open",
        can_download: true,
        can_preview: true
      }
    }
      
    box_content_resources[:basic]["files/#{box_id}"].put(req_params.to_json) { |response, request, result, &block|
      check_request_success(response)
      return false if @return
      if response.code == 200
        @link = {
          preview_url: JSON.parse(response)['shared_link']['url'],
          download_url: JSON.parse(response)['shared_link']['download_url']
        }
        @document = Groupdocument.where(box_id: box_id).last
        if @document
          @document.update_attributes(share_url: @link[:preview_url])
          @document.update_attributes(dl_url: @link[:download_url])
        end
      end
    }
  end

end










