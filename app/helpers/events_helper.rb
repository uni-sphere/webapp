module EventsHelper

	def has_access?
		if @event.adminevent == true and current_user.admin == true
			return nil
		else
			return true
		end
	end
	
end
