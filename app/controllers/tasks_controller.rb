class TasksController < ApplicationController

  before_action :authenticate?
  before_action :task_params, only: [:create, :update, :delete]
  before_action :set_user
  before_action :correct_user?
  before_action :set_group
  
  def create
	  @task = @group.tasks.new(task_params)
    @task.user_id = params[:user_id] if params[:user_id]
    respond_to do |format|
      if @task.save
        format.html { redirect_to user_group_path(@user, @group) }
        format.json { render action: 'show', status: :created, location: @document }
      else
        format.html { render action: 'new' }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @task.update(task_params)
        format.html { user_group_path(@user, @group) }
        format.json { head :no_content }
      else		
        format.html { render action: 'edit' }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def index
    @tasks = @group.tasks.all
  end
  
  def destroy
    @task = Task.find(params[:id])
		@task.destroy
		respond_to do |format|
		  format.html { redirect_to user_group_path(@user, @group) }
		  format.json { head :no_content }
    end
  end
  
  private

  def task_params
    params.require(:task).permit(:name, :date, :group_id, :user_id)
  end

end
