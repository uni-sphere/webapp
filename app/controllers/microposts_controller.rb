class MicropostsController < ApplicationController

before_action :micropost_params
before_action :set_user
before_action :set_group

  def create
    @micropost  = @group.microposts.new(micropost_params)
    if @micropost.save
    	@micropost.update_attributes(user_id: params[:user_id])
      redirect_to user_group_path(@user, @group)
    else
      redirect_to user_group_path(@user, @group)
    end
  end

private

  def micropost_params
      params.require(:micropost).permit(:content, :user_id)
  end
  
  def set_group
    @group = Group.find(params[:group_id]) 
  end
  
  def set_user
    @user = User.find(params[:user_id]) 
  end

end
