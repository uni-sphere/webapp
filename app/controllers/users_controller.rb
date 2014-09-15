class UsersController < ApplicationController

  before_filter :authenticate?, :except => [:new, :create]
  before_filter :not_authenticate?, :only => [:new, :create]
  before_filter :is_admin?, :only => [:destroy]
  before_action :user_params, only: [:create, :update]
  before_action :set_user_origin, only: [:show, :destroy, :update, :edit]
  before_filter :correct_user?, :except => [:new, :create]
  skip_before_filter :verify_authenticity_token, :only => [:create, :update]

  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    respond_to do |format|
      if @user.save
        format.html { redirect_to @user }
        format.json { render action: 'show', status: :created, location: @user }
	      sign_in @user
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end 
  end
  
  def edit
  end
  
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def index
    @users = User.all
  end

  def show
  end
  
  def destroy
    redirect_to users_path
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end 
  
  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :documents_attributes)
  end

  def set_user_origin
    @user = User.find(params[:id])
  end

end
