class SessionsController < ApplicationController
  
  before_filter :not_authenticate?, :only => [:new]
  before_filter :authenticate?, :only => [:destroy]
  skip_before_filter :verify_authenticity_token, :only => [:create]
  
  def new
  end

  def create
    user = User.authenticate(params[:session][:email],
                             params[:session][:password])
    respond_to do |format|
      if !user.nil?
        format.html { redirect_to user, notice: 'session created' }
        format.json { head :no_content }
	sign_in user
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
	render 'new'
	return
      end
    end
  end

  def destroy
	sign_out
	redirect_to root_path
  end
end




