module LayoutsHelper

  def current_groups
    return current_groups = current_user.groups.all if !current_user.nil?
  end
  
  def group_calendar
    return current_calendar = @current_group.calendars.first if !@current_group.nil?
  end
  
  def current_group
    return current_group = current_user.groups.find[:group_id]
  end

end