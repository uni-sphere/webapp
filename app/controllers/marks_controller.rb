class MarksController < ApplicationController

  before_action :authenticate?
  before_action :mark_params, only: [:create, :update, :destroy]
  before_action :set_user
  before_action :correct_user?
  before_action :set_group
  before_action :set_course
  before_action :set_evaluation
  
  def update
    @mark = @evaluation.marks.find(params[:id])
    respond_to do |format|
      if @mark.update(mark_params)
        set_average_evaluation
        set_average_course
        format.html { redirect_to @user }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def index
    @marks = @evaluation.marks
    render "index_user.html.erb" unless is_admin?
  end
  
  private
  
  def set_evaluation
    @evaluation = @course.evaluations.find(params[:evaluation_id])
  end

  def mark_params
    params.require(:mark).permit(:score, :comment)
  end

end