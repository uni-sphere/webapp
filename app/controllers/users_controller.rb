class UsersController < ApplicationController

  before_action :authenticate?, except: [:new, :create, :autocomplete, :import_for_creating, :import_for_involving]
  before_filter :not_authenticate?, only: [:new, :create]
  before_filter :is_admin?, only: [:destroy]
  before_action :user_params, only: [:create, :update]
  before_action :set_user_origin, only: [:show, :destroy, :update, :edit]
  before_filter :correct_user?, except: [:new, :create, :index, :autocomplete, :import_for_creating, :import_for_involving]
  skip_before_filter :verify_authenticity_token, only: [:create, :update]

  def new
    @user = User.new
    render layout: "sign-in"     
  end
  
  def create
    @user = User.new(user_params)
    respond_to do |format|
      if @user.save and @user.create_viewparam(notification_view: '0') and create_box(params[:email])
        format.html { redirect_to @user }
        format.json { render action: 'show', status: :created, location: @user }
	      sign_in @user
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end 
  end
  
  def import_for_creating
    User.import_for_creating(params[:file])
    redirect_to root_url, notice: "Users imported"
  end
  
  def import_for_involving
    User.import_for_involving(params[:file])
    redirect_to root_url, notice: "Members imported"
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
    respond_to do |format|
        format.html
        format.csv { send_data @users.to_csv }
        format.xls { send_data @users.to_csv(col_sep: "\t") }
    end
  end

  def show
    @title = "perso"
  end
  
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to root_path }
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
