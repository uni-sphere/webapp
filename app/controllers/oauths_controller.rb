class OauthsController < ApplicationController
  
  before_action :authenticate?
  
  def receive_oauth
    if params[:state] == session[:_csrf_token]
      send_access_token
    else
      render :file => "public/401.html", :status => :unauthorized, :layout => false
    end
  end
  
  def send_oauth
      oauth_params = {
        response_type: 'code',
        client_id: box_params[:client_id],
        state: session[:_csrf_token]
      }

      box_content_resources[:authorize].get(params: oauth_params) { |response, request, result, &block|
        check_request_success(response, "oauth")
        redirect_to(request.url)
      }
  end
  
end
