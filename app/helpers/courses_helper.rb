module CoursesHelper
  
  def set_course
    @course = @group.courses.find(params[:course_id])
  end
  
  def set_average_evaluation
    average = @evaluation.marks.average(:score)
    @evaluation.update(average: average)
  end
  
  def set_average_course
    @numerator = 0
    @denomerator = 0
    @average = 0
    @evaluations = @course.evaluations
    @numerator = @evaluations.map { |e| e.average * e.coefficient }.reduce(&:+)
    @denomerator = @evaluations.map { |e| e.coefficient }.reduce(&:+) 
    if @denomerator != 0
      @average = @numerator / @denomerator
      @course.update(average: @average)
    elsif
      nil
    end
  end
  
  def get_average_course_user(course)
    @numerator = 0
    @denomerator = 0
    @average = 0
    @evaluations = course.evaluations
    @numerator = @evaluations.map { |e| e.marks.where(user_id: current_user.id).score * e.coefficient }.reduce(&:+)
    @denomerator = @evaluations.map { |e| e.coefficient }.reduce(&:+)
    if @denomerator != 0
      return @average = @numerator / @denomerator
    elsif
      nil
    end
  end
  
end