require 'test_helper'

class MicropostControllerTest < ActionController::TestCase
  test "should get content:string" do
    get :content:string
    assert_response :success
  end

  test "should get user_id:integer" do
    get :user_id:integer
    assert_response :success
  end

  test "should get group_id:integer" do
    get :group_id:integer
    assert_response :success
  end

end
