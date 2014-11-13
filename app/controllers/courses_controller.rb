class CoursesController < ApplicationController

  before_action :authenticate?
  before_action :course_params, only: [:create, :update]
  before_action :set_user
  before_action :correct_user?
  before_action :set_group
  before_action :set_course_origin, only: [:update, :destroy]
  before_action :set_course, only: [:get_average]
  
  def get_average
    respond_to do |format|
      format.html { }
      format.json { render json: @course.average }
    end
  end
  
  def create
	  @course = @group.courses.new(course_params)
    respond_to do |format|
      if @course.save
        format.html { redirect_to user_group_courses_path(@user, @group) }
        format.json { render action: 'show', status: :created, location: @document }
      else
        format.html { render action: 'new' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html { user_group_courses_path(@user, @group) }
        format.json { head :no_content }
      else		
        format.html { render action: 'edit' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def index
    @course = @group.courses.new
    @courses = @group.courses.all
    render "index_user.html.erb" unless is_admin?
  end
  
  def destroy
    @course = Course.find(params[:id])
		@course.destroy
		respond_to do |format|
		  format.html { redirect_to user_group_path(@user, @group) }
		  format.json { head :no_content }
    end
  end
  
  private

  def set_course_origin
    @course = @group.courses.find(params[:id])
  end
  
  def course_params
    params.require(:course).permit(:name, :coefficient, :group_id)
  end

end
