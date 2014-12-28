class NotificationsController < ApplicationController
  
  def index
    @groups = current_user.groups.all.select(:id)
    @activities = PublicActivity::Activity.order("created_at desc").paginate(page: 1, per_page: 4)
  end
  
end
