module EventsHelper

	def has_access?
		if @event.adminevent == true
			return unless @user.admin == true
		end
	end
	
end
