class GroupsController < ApplicationController

  before_action :authenticate?
  before_action :is_admin?, only: [:destroy]
  before_action :set_user
  before_action :correct_user?
  before_action :authorized_acces_group?, only: [:dset_group]
  before_action :set_group_origin, only: [:show, :edit, :update]

  def new
    @group = @user.groups.new
  end
  
  def create
    respond_to do |format|
      if @user.groups.create(group_params)
        format.html { redirect_to user_groups_path(@user) }
        format.json { render action: 'show', status: :created, location: @group }
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
    respond_to do |format|
      if @group.update(group_params)
        format.html { redirect_to user_groups_path(@user) }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  def index
    @groups = @user.groups
  end

  def show
  	@titre = @user.name
  	@user = User.find(params[:user_id])
  	@micropost = Micropost.new
    @microposts = @group.microposts.paginate(:page => params[:page])
    @task = Task.new
    @tasks = @group.tasks.all
  end
  
  def join_group
	  @relation = Relationgroup.new(user_id: params[:user_id], group_id: params[:group_id])	
	    begin 
		    @relation.save!	
		    redirect_to user_groups_path(@user)
	    rescue ActiveRecord::StatementInvalid => e
		    if e.message == 'SQLite3::ConstraintException: UNIQUE constraint failed: relationgroups.user_id, relationgroups.group_id: INSERT INTO "relationgroups" ("created_at", "group_id", "updated_at", "user_id") VALUES (?, ?, ?, ?)'
		      respond_to do |format|
		        format.html { redirect_to user_groups_path(@user), notice: 'You join the group !' }
         	  format.json { render action: 'show', status: :created}
          end
		    end
	    end
  end

  def leave_group
	  @relation = Relationgroup.where(group_id: params[:group_id]).count
	    if @relation <= 1
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
    @group = Group.find(params[:id])
    @group.destroy
    respond_to do |format|
      format.html { redirect_to allgroups_path }
      format.json { head :no_content }
    end
  end

  private 

  def set_group_origin
    @group = @user.groups.find(params[:id])
  end
    
  def group_params
    params.require(:group).permit(:name)
  end
  
end
