class NotificationsController < ApplicationController
  before_action :set_datas, only: [:index]
  def set_datas
    @groups = current_user.groups.all.select(:id)
  end
  
  def index
    @activities = PublicActivity::Activity.order("created_at desc").paginate(page: 1, per_page: 4)
  end
end
