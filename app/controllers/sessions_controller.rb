class SessionsController < ActionController::Base
  
  protect_from_forgery with: :exception
  include SessionsHelper
  include BoxHelper
  include ApplicationHelper
  
  before_filter :not_authenticate?, only: [:new]
  before_filter :authenticate?, only: [:destroy]
  before_action :check_for_mobile

  skip_before_filter :verify_authenticity_token, only: [:create]

  layout "sessions"
  
  def roadmap
    set_under_construction
  end
  
  def new
    @title = "home";
  end

  def create
    
    if params[:confid]
      user = User.find params[:confid]
      user.update(confirmed: true) 
      create_box(user.email) 
    end
    
    if params[:session]
      user = User.authenticate(params[:session][:email],
                             params[:session][:password])
    end
    
    respond_to do |format|
      if !user.nil?
        format.html { redirect_to get_group_documents_path(group_id: user.groups.last, parent_id: 100) }
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




