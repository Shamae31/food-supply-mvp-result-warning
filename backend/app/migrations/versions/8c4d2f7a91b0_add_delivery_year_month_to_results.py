"""add delivery_year_month to negotiation_results

Revision ID: 8c4d2f7a91b0
Revises: 9dfcd3c93c6f
Create Date: 2026-07-28 12:45:00.000000

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8c4d2f7a91b0"
down_revision: str | None = "9dfcd3c93c6f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("negotiation_results", schema=None) as batch_op:
        batch_op.add_column(sa.Column("delivery_year_month", sa.String(length=7), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("negotiation_results", schema=None) as batch_op:
        batch_op.drop_column("delivery_year_month")
