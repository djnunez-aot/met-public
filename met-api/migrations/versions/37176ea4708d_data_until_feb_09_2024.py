"""Data until Feb 09 2024

Revision ID: 37176ea4708d
Revises: ec0128056a33
Create Date: 2024-02-08 12:40:09.456210

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, DateTime, Boolean, Text
from datetime import datetime
from flask import current_app

# revision identifiers, used by Alembic.
revision = '37176ea4708d'
down_revision = 'ec0128056a33'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    
    # Set tenant id as 1
    tenant_id = 1 # ID of the default Tenant

    # Create an ad-hoc table for 'tenant'
    tenant_table = table(
        'tenant',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('short_name', String(10)),
        column('name', String(50)),
        column('description', String(300)),
        column('title', String(30)),
        column('logo_url', String(300)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Assume current_app.config is available and properly configured
    tenant_data = [
        {
            'title': 'Modern Engagement',
            'short_name': current_app.config.get('DEFAULT_TENANT_SHORT_NAME'),
            'name': current_app.config.get('DEFAULT_TENANT_NAME'),
            'description': current_app.config.get(
                'DEFAULT_TENANT_DESCRIPTION'
            ),
            'created_date': datetime.utcnow(),
        }
    ]

    # Perform bulk insert
    op.bulk_insert(tenant_table, tenant_data)
    
    # Create an ad-hoc table for 'user_status'
    user_status_table = table(
        'user_status',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('status_name', String(50)),
        column('description', String(50)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for bulk insert
    user_status_data = [
        {
            'id': 1,
            'status_name': 'ACTIVE',
            'description': 'Active User',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'status_name': 'INACTIVE',
            'description': 'Inactive User',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform bulk insert
    op.bulk_insert(user_status_table, user_status_data)
    
    # Create an ad-hoc table for 'staff_users'
    staff_users_table = table(
        'staff_users',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('first_name', String(50)),
        column('middle_name', String(50)),
        column('last_name', String(50)),
        column('username', String(100)),
        column('email_address', String(100)),
        column('contact_number', String(50)),
        column('external_id', String(50)),
        column('status_id', Integer),
        column('tenant_id', Integer),
        column('created_by', String(50)),
        column('updated_by', String(50))
    )

    # Sample data for insertion
    sample_data = {
        'first_name': 'MET',
        'middle_name': '',
        'last_name': 'System',
        'external_id': '1',  # Replace with actual external_id value
        'status_id': 1,
        'contact_number': '1',
        'tenant_id': tenant_id,
        'created_date': datetime.utcnow(),
        'updated_date': datetime.utcnow(),
    }

    # Perform insert with sample data
    op.bulk_insert(staff_users_table, [sample_data])

    # Create an ad-hoc table for 'widget_type'
    widget_type_table = table(
        'widget_type',
        column('id', Integer),
        column('name', String),
        column('description', String),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('created_by', String),
        column('updated_by', String),
    )

    # Prepare data for bulk insert
    widget_data = [
        {
            'id': 1,
            'name': 'Who is Listening',
            'description': 'Displays contact information for someone who is monitoring the engagement',
        },
        {
            'id': 3,
            'name': 'Phases',
            'description': 'Displays information about the engagement phase',
        },
        {
            'id': 5,
            'name': 'Events',
            'description': 'Displays event details on the engagement',
        },
        {
            'id': 2,
            'name': 'Documents',
            'description': 'Displays important documents on the engagement',
        },
        {
            'id': 4,
            'name': 'Subscribe',
            'description': 'Allows users to subscribe to an engagement',
        },
        {
            'id': 6,
            'name': 'Map',
            'description': 'Display a map that shows the location of the project',
        },
        {
            'id': 7,
            'name': 'Video',
            'description': 'Add a link to a hosted video and link preview',
        },
        {
            'id': 8,
            'name': 'CAC Form',
            'description': 'Add a CAC Form to your project',
        },
        {
            'id': 9,
            'name': 'Timeline',
            'description': 'Create a timeline for a series of events',
        },
        {
            'id': 10,
            'name': 'Poll',
            'description': 'The Poll Widget enables real-time polling and feedback collection from public.',
        },
    ]

    for widget in widget_data:
        widget['created_date'] = datetime.utcnow()
        widget['updated_date'] = datetime.utcnow()

    # Perform bulk insert in a single operation
    op.bulk_insert(widget_type_table, widget_data)

    # Create an ad-hoc table for 'engagement_metadata_taxa'
    engagement_metadata_taxa_table = table(
        'engagement_metadata_taxa',
        column('id', Integer),
        column('tenant_id', Integer),
        column('name', String(64)),
        column('description', String(256)),
        column('freeform', Boolean),
        column('data_type', String(64)),
        column('default_value', Text),
        column('one_per_engagement', Boolean),
        column('position', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )
    


    # Data to be inserted
    taxa_data = [
        {
            'position': 0,
            'tenant_id': tenant_id,
            'name': 'keywords',
            'description': 'Keywords for categorizing the engagement',
            'freeform': True,
            'one_per_engagement': False,
            'data_type': 'text',
        },
        {
            'position': 1,
            'tenant_id': tenant_id,
            'name': 'description',
            'description': 'Description of the engagement',
            'freeform': True,
            'data_type': 'long_text',
            'one_per_engagement': True,
        },
        {
            'position': 2,
            'tenant_id': tenant_id,
            'name': 'jira_ticket_url',
            'description': 'URL of the Jira ticket for this engagement',
            'freeform': True,
            'data_type': 'text',
            'one_per_engagement': True,
        },
        {
            'position': 3,
            'tenant_id': tenant_id,
            'name': 'pmo_project_number',
            'description': 'PMO project number',
            'freeform': True,
            'data_type': 'text',
            'one_per_engagement': True,
        },
        {
            'position': 4,
            'tenant_id': tenant_id,
            'name': 'engagement_category',
            'description': 'Category of the engagement',
            'data_type': 'text',
            'freeform': False,
            'one_per_engagement': False,
        },
        {
            'position': 5,
            'tenant_id': tenant_id,
            'name': 'engagement_method',
            'description': 'Method of engagement',
            'data_type': 'text',
            'default_value': "Survey",
            'freeform': False,
            'one_per_engagement': False,
        },
        {
            'position': 6,
            'tenant_id': tenant_id,
            'name': 'language',
            'description': 'Language of the engagement',
            'data_type': 'text',
            'default_value': "English",
            'freeform': False,
            'one_per_engagement': False,
        },
        {
            'position': 7,
            'tenant_id': tenant_id,
            'name': 'ministry',
            'description': 'Ministry of the engagement',
            'freeform': False,
            'data_type': 'text',
            'one_per_engagement': True,
        },
    ]
    
    for taxa in taxa_data:
        taxa['created_date'] = datetime.utcnow()
        taxa['updated_date'] = datetime.utcnow()

    # Perform bulk insert
    op.bulk_insert(engagement_metadata_taxa_table, taxa_data)

    # Create an ad-hoc table for 'generated_document_type'
    generated_document_type_table = table(
        'generated_document_type',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('name', String(30)),
        column('description', String(100)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for bulk insert
    document_type_data = [
        {
            'id': 1,
            'name': 'comment_sheet',
            'description': 'Comments export for staff',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'name': 'cac_form_sheet',
            'description': 'cac form submission export for staff',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 3,
            'name': 'proponent_comments_sheet',
            'description': 'Comments export for proponent',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform bulk insert
    op.bulk_insert(generated_document_type_table, document_type_data)

    # Create an ad-hoc table for 'generated_document_template'
    generated_document_template_table = table(
        'generated_document_template',
        column('id', Integer),
        column('type_id', Integer),
        column('hash_code', String(64)),
        column('extension', String(10)),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for bulk insert
    document_template_data = [
        {
            'id': 1,
            'type_id': 1,
            'hash_code': None,
            'extension': 'xlsx',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'type_id': 2,
            'hash_code': None,
            'extension': 'xlsx',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 3,
            'type_id': 3,
            'hash_code': None,
            'extension': 'xlsx',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform bulk insert
    op.bulk_insert(generated_document_template_table, document_template_data)

    # Create an ad-hoc table for 'engagement_status'
    engagement_status_table = table(
        'engagement_status',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('status_name', String(50)),
        column('description', String(50)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for bulk insert
    engagement_status_data = [
        {
            'id': 1,
            'status_name': 'Draft',
            'description': 'Not ready to the public',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'status_name': 'Published',
            'description': 'Visible to the public',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 3,
            'status_name': 'Closed',
            'description': 'The engagement period is over',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 4,
            'status_name': 'Scheduled',
            'description': 'Scheduled to be published',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 5,
            'status_name': 'Unpublished',
            'description': 'Unpublished and hidden',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform bulk insert
    op.bulk_insert(engagement_status_table, engagement_status_data)

    # Create an ad-hoc table for 'comment_status'
    comment_status_table = table(
        'comment_status',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('status_name', String(50)),
        column('description', String(50)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for the initial bulk insert
    initial_comment_status_data = [
        {
            'id': 1,
            'status_name': 'Pending',
            'description': 'Comment is pending review',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'status_name': 'Approved',
            'description': 'Comment is accepted for public view',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 3,
            'status_name': 'Rejected',
            'description': 'Comment is rejected and not shown',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 4,
            'status_name': 'Needs further review',
            'description': 'Comment needs further review',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform the initial bulk insert
    op.bulk_insert(comment_status_table, initial_comment_status_data)

    # Create an ad-hoc table for 'membership_status_codes'
    membership_status_codes_table = table(
        'membership_status_codes',
        column('id', Integer),
        column('created_date', DateTime),
        column('updated_date', DateTime),
        column('status_name', String(50)),
        column('description', String(50)),
        column('created_by', String(50)),
        column('updated_by', String(50)),
    )

    # Data for bulk insert
    membership_status_codes_data = [
        {
            'id': 1,
            'status_name': 'ACTIVE',
            'description': 'Active Membership',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 2,
            'status_name': 'INACTIVE',
            'description': 'Inactive Membership',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
        {
            'id': 3,
            'status_name': 'REVOKED',
            'description': 'Revoked Membership',
            'created_date': datetime.utcnow(),
            'updated_date': datetime.utcnow(),
        },
    ]

    # Perform bulk insert
    op.bulk_insert(membership_status_codes_table, membership_status_codes_data)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###