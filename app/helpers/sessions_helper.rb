module SessionsHelper

	def sign_in(user)
    cookies.permanent.signed[:remember_token] = [user.id, user.salt]
    current_user = user
  end
	
	def current_user
    @current_user ||= user_from_remember_token
  end

	def self.authenticate(email, submitted_password)
    user = find_by_email(email)
    return nil  if user.nil?
    return user if user.has_password?(submitted_password)
  end

  def User.authenticate_with_cookie(id, cookie_salt)
    user = User.find_by_id(id)
    return nil  if user.nil?
  	return user if user.salt == cookie_salt
  end

	def signed_in?
    !current_user.nil?
  end

	def sign_out
    cookies.delete(:remember_token)
    cookies.delete(:access_token)
    cookies.delete(:refresh_token)
    current_user = nil
  end

	def deny_access
    redirect_to signin_path, :notice => "Sign in to continue"
  end

	def current_user?(user)
    user == current_user
  end
 
  private
	
	def remember_token
    cookies.signed[:remember_token] || [nil, nil]
  end

  def user_from_remember_token
    User.authenticate_with_cookie(*remember_token)
  end

	def authenticate?
    redirect_to root_path unless signed_in?
  end

	def not_authenticate?
		redirect_to get_group_documents_path(group_id: current_user.groups.last.id, parent_id: 100) if signed_in?
	end

	def correct_user?
    redirect_to root_path unless current_user?(@user) or current_user.nil? or current_user.admin?
	end

	def correct_target
		if request.original_url =~ /groups(.*)/
			redirect_to root_path unless current_user?(@user) and current_user.groups.find(params[:group_id]).present? or current_user.nil? or current_user.admin? 
		elsif request.original_url !~ /groups(.*)/
			redirect_to root_path unless current_user?(@target) or current_user.nil? or current_user.admin?
		end
	end

end

