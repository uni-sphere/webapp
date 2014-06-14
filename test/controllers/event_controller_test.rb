require 'test_helper'

class EventControllerTest < ActionController::TestCase
  test "should get title:string" do
    get :title:string
    assert_response :success
  end

  test "should get allDay:boolean" do
    get :allDay:boolean
    assert_response :success
  end

  test "should get start:datetime" do
    get :start:datetime
    assert_response :success
  end

  test "should get end:datetime" do
    get :end:datetime
    assert_response :success
  end

  test "should get editable:boolean" do
    get :editable:boolean
    assert_response :success
  end

  test "should get adminevent:boolean" do
    get :adminevent:boolean
    assert_response :success
  end

end
