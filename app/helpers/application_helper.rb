module ApplicationHelper
  
  def set_under_construction
    @under_construction = true if Rails.env.production?
  end
  
  def force_under_construction
    @under_construction = true
  end
  
  def is_production?
    ENV["PROD_MODE"] || FALSE ? $ready_for_production = false : true 
  end
  
  def set_ready_for_production
    $ready_for_production = true
  end
  
  def check_for_mobile
    session[:mobile_override] = params[:mobile] if params[:mobile]
    prepare_for_mobile if mobile_device?
  end

  def prepare_for_mobile
    prepend_view_path Rails.root + 'app' + 'views_mobile'
  end

  def mobile_device?
    if session[:mobile_override]
      session[:mobile_override] == "1"
    else
       (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/)
    end
  end
  # helper_method :mobile_device?

  def full_title(page_title)
    base_title = "Unisphere"
    if page_title.empty?
      base_title
    else
      "#{base_title} | #{page_title}"
    end
  end

  # user
  def is_admin?
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
    return 'active' if request.path =~ /group(.*)/
    ''
  end

  def url_perso? 
    return 'active' if !(request.path =~ /group(.*)/)
    ''
  end
  
  # random key
  
  def random_key
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
    password = ''
    8.times { password << chars[rand(chars.size)] }
    password
  end
  
end

