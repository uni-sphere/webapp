module LayoutsHelper

  def current_groups
    current_user.nil? ? nil : current_groups = current_user.groups.all
  end
  
  def group_calendar
    current_group.nil? ? nil : group_calendar = current_group.calendar
  end
  
  def current_group
    current_group = current_user.groups.find(params[:group_id])
  end
  
  def current_group_exists?
    current_user.groups.exists?(params[:group_id])
  end
  
  def current_user_notification_view
    current_user_notification_view = Time.at(current_user.viewparam.notification_view).utc
  end
    
  def notification_exists?
    current_groups.each do |group|
      @answer = true if PublicActivity::Activity.exists?(['owner_id = ? and updated_at > ?', group.id, current_user_notification_view])
    end
    return @answer
  end
  
  # def time_difference seconds
  #   days = (seconds / 1.day).floor
  #   seconds -= days.days
  #   hours = (seconds / 1.hour).floor
  #   seconds -= hours.hours
  #   minutes = (seconds / 1.minute).floor
  #   seconds -= minutes.minutes
  #   @time_difference = { days: days, hours: hours, minutes: minutes, seconds: seconds }
  # end
  #
  # def time_ago(time)
  #   time_difference(Time.now.to_i - time.to_i)
  #   if @time_difference[:minutes] <= 1 and @time_difference[:hours] = 0 and @time_difference[:days] = 0
  #     return @time_difference[:seconds].to_s + " sec ago"
  #   elsif @time_difference[:hours] <= 1 and @time_difference[:minutes] > 1 and @time_difference[:days] = 0
  #     return @time_difference[:minutes].to_s + " mn ago"
  #   elsif @time_difference[:days] <= 1 and @time_difference[:hours] > 1
  #     return @time_difference[:hours].to_s + " h ago"
  #   elsif @time_difference[:days] >= 7
  #     return "a long time ago"
  #   end
  # end
  
end