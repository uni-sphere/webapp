class SessionsController < ActionController::Base
  
  protect_from_forgery with: :exception
  include SessionsHelper
  include BoxHelper
  include ApplicationHelper
  
  before_filter :authenticate?, only: [:destroy]
  before_action :set_mobile_view

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
      user.confirmed = true
      user.save(validate: false)
      create_box(user.email)
    elsif params[:session]
      user = User.authenticate(params[:session][:email],
                              params[:session][:password])
    elsif params[:id]
      user = User.find params[:id]
    end
    logger.info user
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
    current_user.destroy if current_user.updated_at == current_user.created_at
    render json: { url: root_path }.to_json
  end
  
end




