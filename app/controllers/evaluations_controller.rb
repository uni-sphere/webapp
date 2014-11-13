class EvaluationsController < ApplicationController

  before_action :authenticate?
  before_action :evaluation_params, only: [:create]
  before_action :set_user
  before_action :correct_user?
  before_action :set_group
  before_action :set_course, except: [:set_average_course]
  before_action :set_evaluation_origin, except: [:create, :get_average]

  def get_average
    @evaluation = @course.evaluations.find(params[:evaluation_id])
    respond_to do |format|
      format.html { }
      format.json { render json: @evaluation.average }
    end
  end
  
  def create
	  @evaluation = @course.evaluations.new(evaluation_params)
    @users = @group.users
    respond_to do |format|
      if @evaluation.save
        @users.each do |user|
          @evaluation.marks.create(user_id: user.id, score: 0)
          set_average_evaluation
          set_average_course
        end
        format.html { redirect_to user_group_courses_path(@user, @group) }
        format.json { render action: 'show' }
      else
        format.html { render json: @evaluation.errors }
        format.json { render json: @evaluation.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def update
    respond_to do |format|
      if @evaluation.update(evaluation_params)
        set_average_course
        format.html { redirect_to @user }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def destroy
		@evaluation.destroy
		respond_to do |format|
		  format.html { redirect_to user_group_courses_path(@user, @group) }
		  format.json { head :no_content }
    end
  end
  
  private

  def evaluation_params
    params.require(:evaluation).permit(:name, :coefficient)
  end
  
  def set_evaluation_origin
    @evaluation = @course.evaluations.find(params[:id])
  end

end
