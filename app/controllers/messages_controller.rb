class MessagesController < ApplicationController

  def create
    @chat = current_group.groupchats.find params[:groupchat_id]
    respond_to do |format|
      if @chat.messages.create(content: params[:content], owner_id: params[:owner_id])
        format.html { }
        format.json { head :no_content }
      end
    end
  end

end