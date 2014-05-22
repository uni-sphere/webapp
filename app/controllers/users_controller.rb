class UsersController < ApplicationController

  before_action :set_user, only: [:show, :destroy, :update, :edit]
  before_action :user_params, only: [:create, :update]
  before_filter :correct_user, :only => [:edit, :update]
  before_filter :authenticate?, :only => [:edit, :update, :index, :destroy, :show]
  before_filter :not_authenticate?, :only => [:new, :create]
  before_filter :is_admin?, :only => [:destroy]
  skip_before_filter :verify_authenticity_token, :only => [:create, :update]

private

  def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :documents_attributes)
  end

  def set_user
      @user = User.find(params[:id])
  end

# in application controller
  #def is_admin?
  #	redirect_to(root_path) unless current_user.admin?	
  #end

public

  def destroy
    @user.destroy
    redirect_to users_path
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    return
    end
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User updated' }
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

  def new
    @user = User.new
    #@file = @user.documents.new
  end

  def edit
  end

  def create
    @user = User.new(user_params)
    respond_to do |format|
      if @user.save #and @user.documents.create(params[:file])
        format.html { redirect_to @user, notice: 'User created' }
        format.json { render action: 'show', status: :created, location: @user }
	sign_in @user
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
  end 
 end

end
