class GroupsController < ApplicationController

  before_action :set_user
  before_action :authenticate?
  before_action :is_admin?, only: [:destroy]
  before_action :correct_user 
  before_action :set_group, only: [:show, :edit, :update]


  def show_all
    @groups = Group.all
  end

  def index
    @groups = @user.groups
  end

  def show
  end

  def new
    @group = @user.groups.new
  end

  def edit
  end

  def create

    respond_to do |format|
      if @user.groups.create(group_params)
        format.html { redirect_to user_groups_path(@user), notice: 'Group was successfully created.' }
        format.json { render action: 'show', status: :created, location: @group }
      else
        format.html { render action: 'new' }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @group.update(group_params)
        format.html { redirect_to user_groups_path(@user), notice: 'Group was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @group.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @group = Group.find(params[:id])
    @group.destroy
    respond_to do |format|
      format.html { redirect_to allgroups_path	 }
      format.json { head :no_content }
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

  private

    def is_member?		
	current_user.groups.each do |current_user_group|
	@answer = true if current_user_group.id == @group.id
	end
	return @answer
    end

    def authorized_acces_group?
	redirect_to(root_path) unless is_member? or current_user.admin?
    end

    def set_user
      @user = User.find(params[:user_id])
    end    

    def set_group
      @group = @user.groups.find(params[:id])
      authorized_acces_group?
    end
    
    # Never trust parameters from the scary internet, only allow the white list through.
    def group_params
      params.require(:group).permit(:name)
    end
end
