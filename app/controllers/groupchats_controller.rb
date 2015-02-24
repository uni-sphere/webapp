class GroupchatsController < ApplicationController
  
  before_action :force_under_construction

  def index
    if (params[:channel])
      @groupchat = current_group.groupchats.where(channel: params[:channel]).first
    else
      @groupchat = current_group.groupchats.where(name: 'general').first
    end
    @groupchats = current_group.groupchats.all
    @messages = @groupchat.messages.all
    
    respond_to do |format|
      format.html { }
      format.json do
        @messages_json = {}
        @i = 1
        @messages.each do |message|
          @messages_json[@i] = { owner: User.find(message.owner_id).name, time: message.created_at, content: message.content }
          @i = @i + 1
        end
        render json: {:messages => @messages_json, :length => @i}
      end
    end
  end
  
  def create
    respond_to do |format|
      if current_group.groupchats.create(name: params[:name], channel: channel_key)
        format.html { }
        format.json { head :no_content }
      else
        format.html { }
        format.json { render json: @edited_groupchat.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def update
    @edited_groupchat = current_group.groupchats.find params[:groupchat_id]
    respond_to do |format|
      if @edited_groupchat.update(name: params[:name])
        format.html { }
        format.json { head :no_content }
      else
        format.html { }
        format.json { render json: @edited_groupchat.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def destroy
    @destroyed_groupchat = current_group.groupchats.find params[:groupchat_id]
    respond_to do |format|
      if @edited_groupchat.destroy
        format.html { }
        format.json { head :no_content }
      else
        format.html { }
        format.json { render json: @edited_groupchat.errors, status: :unprocessable_entity }
      end
    end
  end
  
end
