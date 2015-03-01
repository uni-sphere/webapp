class UsersController < ApplicationController

  
  
  layout "main", except: [:new, :create]

  # before_filter :check_for_mobile, :only => [:new, :edit]

  before_action :authenticate?, except: [:new, :create, :autocomplete, :import_for_creating, :import_for_involving]
  before_filter :not_authenticate?, only: [:new, :create]
  before_filter :prepare_for_mobile, :only => [:show]
  before_filter :is_admin?, only: [:destroy]
  before_action :user_params, only: [:create, :update]
  before_action :set_user_origin, only: [:show, :destroy, :update, :edit]
  before_filter :correct_user?, except: [:new, :create, :index, :autocomplete, :import_for_creating, :import_for_involving]
  skip_before_filter :verify_authenticity_token, only: [:create, :update]

  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    
    @user.name = random_key if @user.email == nil
    
    respond_to do |format|
      if @user.save and @user.create_viewparam(notification_view: '0') and @user.groups.create(name: 'My first group', admin_id: @user.id) and @user.groups.last.groupfolders.create(name: Group.last.name, parent_id: 100) and Group.last.create_calendar(name: 'group calendar') and Group.last.groupchats.create(name: 'general', channel: random_key)
        format.html { redirect_to get_group_documents_path(group_id: @user.groups.last.id, parent_id: 100) }
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
    redirect_to get_group_documents_path(group_id: current_group.id, parent_id: 100), notice: "Users created"
  end
  
  def import_for_involving
    User.import_for_involving(params[:file], params[:group_id])
    redirect_to get_group_documents_path(group_id: current_group.id, parent_id: 100), notice: "Members invited"
  end
  
  def edit
  end
  
  def update
    @user.update_attributes(user_params)
    respond_to do |format|
      if @user.save
        sign_in @user
        UserMailer.welcome_email(@user.id, @user.name, @user.email).deliver
        format.html { redirect_to get_group_documents_path(group_id: current_user.groups.last.id, parent_id: 100), notice: "User created" }
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
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def set_user_origin
    @user = User.find(params[:id])
  end

end
