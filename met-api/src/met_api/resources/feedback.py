# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""API endpoints for managing a feedback resource."""

from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.auth import jwt as _jwt
from met_api.schemas import utils as schema_utils
from met_api.models.pagination_options import PaginationOptions
from met_api.services.feedback_service import FeedbackService
from met_api.constants.feedback import FeedbackStatusType
from met_api.utils.token_info import TokenInfo
from met_api.utils.util import allowedorigins, cors_preflight


API = Namespace('feedbacks', description='Endpoints for Feedbacks Management')

# For operations that don't require an ID


@cors_preflight('GET, POST, OPTIONS')
@API.route('/', methods=['GET', 'POST'])
class FeedbackList(Resource):
    """Feedback List Resource."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def get():
        """Fetch feedbacks page."""
        try:
            args = request.args
            search_text = args.get('search_text', '', str)
            pagination_options = PaginationOptions(
                page=args.get('page', None, int),
                size=args.get('size', None, int),
                sort_key=args.get('sort_key', 'name', str),
                sort_order=args.get('sort_order', 'asc', str),
            )
            status_int = args.get(
                'status', FeedbackStatusType.Unreviewed.value, int)
            status = FeedbackStatusType(status_int)
            feedback_records = FeedbackService().get_feedback_paginated(
                pagination_options, search_text, status,)

            return feedback_records, HTTPStatus.OK
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.optional
    def post():
        """Create a new feedback."""
        try:
            user_id = TokenInfo.get_id()
            request_json = request.get_json()
            valid_format, errors = schema_utils.validate(
                request_json, 'feedback')
            if not valid_format:
                return {'message': schema_utils.serialize(errors)}, HTTPStatus.BAD_REQUEST
            result = FeedbackService().create_feedback(request_json, user_id)
            return result, HTTPStatus.OK
        except KeyError:
            return 'feedback was not found', HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight('DELETE, PATCH')
@API.route('/<int:feedback_id>', methods=['DELETE', 'PATCH'])
class FeedbackById(Resource):
    """Feedback Id Resource."""

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def delete(feedback_id):
        """Remove Feedback for an engagement."""
        try:
            result = FeedbackService().delete_feedback(feedback_id)
            if result:
                return 'Feedback successfully removed', HTTPStatus.OK
            return 'Feedback not found', HTTPStatus.NOT_FOUND
        except KeyError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR
        except ValueError as err:
            return str(err), HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin(origins=allowedorigins())
    @_jwt.requires_auth
    def patch(feedback_id):
        """Update feedback by ID."""
        feedback_data = request.get_json()
        updated_feedback = FeedbackService.update_feedback(
            feedback_id, feedback_data)
        if updated_feedback:
            return updated_feedback, HTTPStatus.OK
        return {'message': 'Feedback not found'}, HTTPStatus.NOT_FOUND
