"""add target_year_month to negotiation_cases

Revision ID: b4f6a2d831c9
Revises: 8c4d2f7a91b0
Create Date: 2026-07-28 13:05:00.000000

"""
from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b4f6a2d831c9"
down_revision: str | None = "8c4d2f7a91b0"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("negotiation_cases", schema=None) as batch_op:
        batch_op.add_column(sa.Column("target_year_month", sa.String(length=7), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("negotiation_cases", schema=None) as batch_op:
        batch_op.drop_column("target_year_month")
