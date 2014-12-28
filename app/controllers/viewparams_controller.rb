class ViewparamsController < ApplicationController

  # before_action :authenticate?
  # before_action :task_params, only: [:create, :update, :delete]
  # before_action :set_user
  # before_action :correct_user?
  # before_action :set_group
  before_action :set_user

  def update
    @viewparam = @user.viewparam
    respond_to do |format|
      if @viewparam.update_attributes(notification_view: params[:notification_view])
        format.html {  }
        format.json { head :no_content }
      else
        format.html {  }
        format.json { render json: @viewparam.errors, status: :unprocessable_entity }
      end
    end
  end

end
