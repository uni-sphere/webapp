class ViewparamsController < ApplicationController

  # before_action :authenticate?
  # before_action :task_params, only: [:create, :update, :delete]
  # before_action :set_user
  # before_action :correct_user?
  # before_action :set_group
  before_action :set_user

  def update
    respond_to do |format|
      if @user.viewparam.update(notification_view: params[:notification_view])
        format.html {  }
        format.json { head :no_content }
      end
    end
  end

end
