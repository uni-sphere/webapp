class SigninController < ActionController::Base
  
  protect_from_forgery with: :exception
  include SessionsHelper
  include BoxHelper
  
  before_filter :not_authenticate?, only: [:new]
  before_filter :authenticate?, only: [:destroy]
  skip_before_filter :verify_authenticity_token, only: [:create]

  layout "signin"
  
  def new
    @title = "home";
  end
  def clients 
    @title = "clients";
  end
  def roadmap
    @title = "roadmap";
  end

  def create
    user = User.authenticate(params[:session][:email],params[:session][:password])
    respond_to do |format|
      if !user.nil?
        format.html { redirect_to get_user_documents_path(folder: '0') }
        format.json { head :no_content }
	      sign_in user
        refresh_token
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
        return
      end
    end
  end

  def destroy
	  sign_out
	  redirect_to root_path
  end
  
end




