module ApplicationHelper
  
  # user
  
  def is_admin?
	  redirect_to(root_path) unless current_user.admin?	
    return current_user.admin
  end
  
  def set_user
    @user = User.find(params[:user_id]) 
  end
  
  # group
  
  def set_group
    @group = Group.find(params[:group_id]) 
    authorized_acces_group?
  end
  
  def is_member?		
    current_user.groups.each do |current_user_group|
      @answer = true if current_user_group.id == @group.id
  end
    return @answer
  end

  def authorized_acces_group?
    redirect_to(root_path) unless is_member? or current_user.admin?
  end
  
end
