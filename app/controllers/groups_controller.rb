class GroupsController < ApplicationController

  autocomplete :user, :name, full: true, limit: 5, extra_data: [:email]
  
  before_action :authenticate?, except: [:autocomplete, :send_invitation]
  before_action :is_admin?, only: [:destroy]
  before_action :set_user, except: [:autocomplete, :send_invitation, :autocomplete_user_name]
  before_action :set_users, only: [:send_invitation]
  before_action :correct_user?, except: [:autocomplete, :send_invitation, :autocomplete_user_name]
  before_action :set_group_origin, only: [:show, :edit]
  

  def new
    @group = @user.groups.new
  end
  
  def create
    respond_to do |format|
      if current_user.groups.create(name: params[:name], admin_id: current_user.id) and Group.last.create_calendar(name: 'group calendar') and Group.last.groupfolders.create(name: Group.last.name, parent_id: 100) and Group.last.groupchats.create(name: 'general', channel: random_key)
        format.html { render :nothing => true }
        format.json { render json: Group.last }
      else
        format.html { render action: 'new' }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def edit
  end
  
  def show_all
    @groups = Group.all
  end
  
  def update
    @group = Group.find params[:group_id]
    respond_to do |format|
      if @group.admin_id == current_user.id
        if @group.update(name: params[:name])
          format.html { redirect_to user_groups_path(@user) }
          format.json { render json: {success: true}.to_json }
        else
          format.html { render action: 'edit' }
          format.json { render json: {success: false}.to_json }
        end
      end
      format.json { render json: {success: false}.to_json }
    end
  end

  def index
    @groups = @user.groups
  end
  
  def show
  	@titre = @user.name
  	@user = User.find(params[:user_id])
    @group = Group.find(params[:id])
    @calendar = @group.calendar 
  end
  
  def join_group
	  @relation = Relationgroup.new(user_id: params[:user_id], group_id: params[:group_id])
	    begin 
		    @relation.save!
        # @relation.create_activity :join_group, owner: set_group, recipient: @user
	    rescue ActiveRecord::StatementInvalid => e
		    if e.message == 'SQLite3::ConstraintException: UNIQUE constraint failed: relationgroups.user_id, relationgroups.group_id: INSERT INTO "relationgroups" ("created_at", "group_id", "updated_at", "user_id") VALUES (?, ?, ?, ?)'
		    end
	    end
    redirect_to get_group_documents_path(group_id: params[:group_id], parent_id: 100)
  end

  def leave_group
	  @relation = Relationgroup.where(group_id: params[:group_id]).count
	    if @relation <= 1
        PublicActivity::Activity.where(owner_id: params[:group_id]).delete_all
		    @user.groups.find(params[:group_id]).delete
	    else	
		    Relationgroup.where(["user_id = :user_id and group_id = :group_id", { user_id: params[:user_id], group_id: params[:group_id] }]).destroy_all
	    end
      respond_to do |format|
        format.html { redirect_to user_groups_path(@user) }
        format.json { head :no_content }
      end
  end

  def destroy
    @group = Group.find(params[:group_id])
    if @group.admin_id == current_user.id
      # PublicActivity::Activity.where(owner_id: @group.id).destroy
      @group.destroy
      redirect_to get_group_documents_path(group_id: current_user.groups.last.id, parent_id: 100)
    else
      redirect_to get_group_documents_path(group_id: params[:group_id], parent_id: 100)
    end
  end
  
  def autocomplete
    @search = User.select(:email).where('email LIKE ?', "#{params[:query]}%")
    render json: @search
  end 

  def send_invitation
    @users.each do |email|
      if @user = User.where(email: email).first
        @relation = Relationgroup.new(user_id: @user.id, group_id: params[:group_id])	
  	    begin 
  		    @relation.save! 
  	    rescue ActiveRecord::StatementInvalid => e
  		    if e.message == 'SQLite3::ConstraintException: UNIQUE constraint failed: relationgroups.user_id, relationgroups.group_id: INSERT INTO "relationgroups" ("created_at", "group_id", "updated_at", "user_id") VALUES (?, ?, ?, ?)'
  		    end
  	    end
      else
        @user = User.new
        @user.name = random_key
        @user.email = email
        group = Group.find params[:group_id]
        @user.save and @user.create_viewparam(notification_view: '0') and @user.groups.create(name: 'My first group', admin_id: @user.id) and @user.groups.last.groupfolders.create(name: Group.last.name, parent_id: 100) and Group.last.create_calendar(name: 'group calendar') and Group.last.groupchats.create(name: 'general', channel: random_key)
        UserMailer.invitation_email(@user.id, current_user.name, @user.name, email, group.name).deliver
        
        @relation = Relationgroup.new(user_id: @user.id, group_id: params[:group_id])	
  	    begin 
  		    @relation.save! 
  	    rescue ActiveRecord::StatementInvalid => e
  		    if e.message == 'SQLite3::ConstraintException: UNIQUE constraint failed: relationgroups.user_id, relationgroups.group_id: INSERT INTO "relationgroups" ("created_at", "group_id", "updated_at", "user_id") VALUES (?, ?, ?, ?)'
  		    end
  	    end
        
      end
    end
    redirect_to get_group_documents_path(group_id: params[:group_id], parent_id: 100)
  end

  private 

  def set_users
    @users = params[:user][:email].gsub(/[ ]/, '').split(',')
  end
  
  def set_group_origin
    @group = @user.groups.find(params[:id])
  end
  
  def group_params
    params.require(:group).permit(:name)
  end
  
end
