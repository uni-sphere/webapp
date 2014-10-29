module LayoutsHelper

  def current_groups
    current_user.nil? ? nil : current_groups = current_user.groups.all
  end
  
  def group_calendar
    current_group.nil? ? nil : group_calendar = current_group.calendar
  end
  
  def current_group
    current_user.groups.find(params[:group_id]).nil? ? nil : current_group = current_user.groups.find(params[:group_id])
  end

end