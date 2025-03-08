import * as React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface ProfileCardProps {
  /** User's name */
  name: string;
  /** User's role or title */
  role?: string;
  /** User's profile image URL */
  imageUrl?: string;
  /** User's initials (used as fallback when image is not available) */
  initials?: string;
  /** Short bio or description */
  bio?: string;
  /** Array of skills or tags to display */
  skills?: string[];
  /** Primary action button text */
  primaryActionText?: string;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Handler for primary action button click */
  onPrimaryActionClick?: () => void;
  /** Handler for secondary action button click */
  onSecondaryActionClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the card should have hover effects */
  interactive?: boolean;
}

export function ProfileCard({
  name,
  role,
  imageUrl,
  initials,
  bio,
  skills = [],
  primaryActionText = "View Profile",
  secondaryActionText,
  onPrimaryActionClick,
  onSecondaryActionClick,
  className,
  interactive = false,
}: ProfileCardProps) {
  // Generate initials if not provided
  const derivedInitials = React.useMemo(() => {
    if (initials) return initials;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, [name, initials]);

  // Create action buttons
  const actions = (
    <>
      {secondaryActionText && (
        <Button variant="outline" size="sm" onClick={onSecondaryActionClick}>
          {secondaryActionText}
        </Button>
      )}
      <Button size="sm" onClick={onPrimaryActionClick}>
        {primaryActionText}
      </Button>
    </>
  );

  // Create content with bio and skills
  const content = (
    <div className="space-y-3">
      {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  // Create title with avatar and name/role
  const title = (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{derivedInitials}</AvatarFallback>
      </Avatar>
      <div>{name}</div>
    </div>
  );

  return (
    <Card
      title={title}
      subtitle={role}
      content={content}
      actions={actions}
      interactive={interactive}
      className={cn("max-w-sm", className)}
      headerClassName="pb-2"
    />
  );
}
