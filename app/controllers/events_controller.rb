class EventsController < ApplicationController

  before_action :calendar_params, only: [:create, :update]
  before_action :set_calendar, only: [:update, :create, :index, :update]
  before_action :set_user, only: [:create] 
#  before_action :set_event, only: [:update, :destroy]
 

	def index
		@events = @calendar.events.all
		@events = @calendar.events.between(params['start'],params['end']) if (params['start'] && params['end'])
			respond_to do |format|
				format.html	
		      		format.json { render json: @events }
		    	end
	end

	def create
		@event = @calendar.events.new(calendar_params)
		respond_to do |format|
			if @event.save	
		      		format.json { render action: 'index' }
	      		else
				format.json { render json: @event.errors, status: :unprocessable_entity }
			end
	  	end 
	end


	def update
	    @event = @calendar.events.find(params[:id])
	    respond_to do |format|
	      if @event.update_attributes(params[:event])
		format.html { redirect_to @event, notice: 'Event was successfully updated.' }
		format.json { head :no_content }
	      else
		format.html { render action: "edit" }
		format.json { render json: @event.errors, status: :unprocessable_entity }
	      end
	    end
	  end
	
	def destroy
		@event.destroy
    		respond_to do |format|
	     		format.html { redirect_to root_path }
	      		format.json { head :no_content }
    		end
	end

private

	def set_user
		@user = User.find(params[:user_id])
	end

	def set_calendar
		@calendar = Calendar.find(params[:calendar_id])
	end

	def set_event
		@event = @calendar.events.find(params[:id])
	end

	def calendar_params
      		params.require(:event).permit(:title, :start, :end, :allDay, :editable, :adminevent)
  	end
end
