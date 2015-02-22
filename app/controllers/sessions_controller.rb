class SessionsController < ActionController::Base
  
  protect_from_forgery with: :exception
  include SessionsHelper
  include BoxHelper
  include ApplicationHelper
  
  before_filter :not_authenticate?, only: [:new]
  before_filter :authenticate?, only: [:destroy]
  before_action :prepare_for_mobile

  skip_before_filter :verify_authenticity_token, only: [:create]

  layout "sessions"
  
  def new
    @title = "home";
  end

  def create
    user = User.authenticate(params[:session][:email],
                             params[:session][:password])
    respond_to do |format|
      if !user.nil?
        format.html { redirect_to get_user_documents_path(folder: '0') }
        format.json { head :no_content }
	      sign_in user
        refresh_token
      else
        format.html { redirect_to root_path }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
	  sign_out
	  redirect_to root_path
  end
  
end




