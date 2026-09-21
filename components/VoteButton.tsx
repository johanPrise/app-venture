"use client"

import React, { useOptimistic, useState, useTransition } from 'react'
import { ThumbsUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { signInToVote, toggleVote } from '@/lib/action'
import { cn } from '@/lib/utils'

type VoteState = { votes: number; hasVoted: boolean }

const VoteButton = ({ startupId, initialVotes, initialHasVoted, isLoggedIn }: {
    startupId: string;
    initialVotes: number;
    initialHasVoted: boolean;
    isLoggedIn: boolean;
}) => {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [voteState, setVoteState] = useState<VoteState>({ votes: initialVotes, hasVoted: initialHasVoted });
    const [optimisticVote, toggleOptimisticVote] = useOptimistic<VoteState, void>(voteState, (state) => ({
        votes: Math.max(0, state.votes + (state.hasVoted ? -1 : 1)),
        hasVoted: !state.hasVoted,
    }));

    const handleClick = () => {
        startTransition(async () => {
            if(!isLoggedIn){
                await signInToVote(startupId);
                return;
            }
            toggleOptimisticVote();
            const result = await toggleVote(startupId);
            if(result.status == 'SUCCESS'){
                setVoteState({ votes: result.votes, hasVoted: result.hasVoted });
            } else {
                toast({
                    title:'Error',
                    description: result.error || 'An unexpected error has occured',
                    variant:'destructive'
                })
            }
        });
    };

    const { votes, hasVoted } = optimisticVote;
    const label = !isLoggedIn ? 'Connectez-vous pour voter' : hasVoted ? 'Voté' : 'Voter';

    return (
        <button
            type='button'
            onClick={handleClick}
            disabled={isPending}
            aria-pressed={isLoggedIn ? hasVoted : undefined}
            title={!isLoggedIn ? 'Connectez-vous pour voter' : hasVoted ? 'Retirer mon vote' : 'Voter pour ce pitch'}
            className={cn('vote-btn', hasVoted && 'vote-btn_active')}
        >
            <ThumbsUp className={cn('size-5', hasVoted && 'fill-current')} />
            <span>{label}</span>
            <span className='vote-btn_count'>{votes}</span>
        </button>
    )
}

export default VoteButton
