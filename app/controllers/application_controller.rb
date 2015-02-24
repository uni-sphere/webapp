class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include PublicActivity::StoreController
  include SessionsHelper
  include LayoutsHelper
  include CoursesHelper
  include ApplicationHelper
  include BoxHelper
  
  # before_action :set_datas, only: [:index_notification]
  # before_action :index_notification
  before_action :has_group? 
  
 

  layout "main", except: [:users]


  
  def set_datas
    @groups = current_user.groups.all.select(:id)
  end
  
  def index_notification
    @activities = PublicActivity::Activity.order("created_at desc").paginate(page: 1, per_page: 4)
    if current_groups
      current_groups.each do |group|
        @notification_amount =+ PublicActivity::Activity.where(owner_id: group.id).where("updated_at > ?", Time.at(current_user.viewparam.notification_view).utc).count
      end
      return @notification_amount
    end
  end
  
  def has_group?
    render 'layouts/no_groups' if request.url.include? 'group' and current_groups == nil
  end

end

