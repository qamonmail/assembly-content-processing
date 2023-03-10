/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/containerContent/ContainerUnpack
 * @param data `~lib/typedarray/Uint8Array`
 * @returns `~lib/array/Array<~lib/typedarray/Uint8Array>`
 */
export declare function ContainerUnpack(data: Uint8Array): Array<Uint8Array>;
/**
 * assembly/containerContent/ContainerPack
 * @param bodyBytes `~lib/typedarray/Uint8Array`
 * @param nonce `~lib/typedarray/Uint8Array`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function ContainerPack(bodyBytes: Uint8Array, nonce: Uint8Array): Uint8Array;
/**
 * assembly/messageContent/MessageContentPack
 * @param subjectBytes `~lib/typedarray/Uint8Array`
 * @param signature `~lib/typedarray/Uint8Array`
 * @param attacheds `~lib/typedarray/Uint8Array`
 * @param previousMessageAddress `~lib/typedarray/Uint8Array`
 * @param bodyBytes `~lib/typedarray/Uint8Array`
 * @returns `~lib/typedarray/Uint8Array`
 */
export declare function MessageContentPack(subjectBytes: Uint8Array, signature: Uint8Array, attacheds: Uint8Array, previousMessageAddress: Uint8Array, bodyBytes: Uint8Array): Uint8Array;
/**
 * assembly/messageContent/MessageContentUnpack
 * @param data `~lib/typedarray/Uint8Array`
 * @returns `~lib/array/Array<~lib/typedarray/Uint8Array>`
 */
export declare function MessageContentUnpack(data: Uint8Array): Array<Uint8Array>;
