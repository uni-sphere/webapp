module ApplicationHelper
  
  def full_title(page_title)
    base_title = "InfiniTree"
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end

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
  
  # all
  
  def set_target
    if request.original_url =~ /groups(.*)/
	    @target = Group.find(params[:group_id])  
	    @user = User.find(params[:user_id])
      correct_user?  	
    else
      @target = User.find(params[:user_id])
      # @user = @target
    end
  end

  def url_groups? 
    return 'active' if request.path =~ /groups(.*)/
    ''
  end

  def url_perso? 
    return 'active' if !(request.path =~ /groups(.*)/)
    ''
  end
  
end

