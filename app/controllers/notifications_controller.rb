class NotificationsController < ApplicationController
  before_action :set_datas
  
  def set_datas
    @groups = current_user.groups.all.select(:id)
  end
  
  def index
    @activities = PublicActivity::Activity.order("created_at desc")
  end
end
